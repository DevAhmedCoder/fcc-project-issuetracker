"use strict";
const Issue = require("../model/index.js").Issue;
const Project = require("../model/index.js").Project;
module.exports = (app) => {
  app
    .route("/api/issues/:project")
    .post(async (req, res) => {
      try {
        const issue = await Issue.create(req.body);
        let project = await Project.findOne({ name: req.params.project });
        if (project === null) {
          await Project.create({
            name: req.params.project,
            issues: [issue._id],
          });
        } else {
          await Project.findByIdAndUpdate(project._id, {
            issues: [...project.issues, issue._id],
          });
        }
        res.json(issue);
      } catch (error) {
        if (error.message.includes("Issue validation failed")) {
          res.json({ error: "required field(s) missing" });
        } else return res.json({ error: error.message });
      }
    })
    .get(async (req, res) => {
      try {
        const project = await Project.findOne({
          name: req.params.project,
        }).populate({
          path: "issues",
          match: req.query,
        });
        res.json(project.issues);
      } catch (error) {
        res.json({ error: error.message });
      }
    })
    .put(async (req, res) => {
      let { _id, ...fieldsToUpdate } = req.body;
      try {
        if (_id) {
          if (Object.keys(fieldsToUpdate).length) {
            let issue = await Issue.findByIdAndUpdate(_id, fieldsToUpdate);

            if (issue) {
              issue = await Issue.findById(_id);
              res.json({ result: "successfully updated", _id });
            } else {
              return res.json({ error: "could not update", _id });
            }
          } else
            return res.json({
              error: "no update field(s) sent",
              _id,
            });
        } else return res.json({ error: "missing _id" });
      } catch (error) {
        res.json({ error: error.message });
      }
    })
    .delete(async (req, res) => {
      const { _id, ...fieldsToDelete } = req.body;
      try {
        if (_id) {
          const issueTest = await Issue.findById(_id);
          if (issueTest) {
            await Issue.findByIdAndRemove(req.body);
            await Project.updateOne(
              { name: req.params.project },
              {
                $pullAll: {
                  issues: [{ _id }],
                },
              }
            );
            res.json({ result: "successfully deleted", _id });
          } else return res.json({ error: "could not delete", _id });
        } else return res.json({ error: "missing _id" });
      } catch (error) {
        res.json({ error: "could not delete", _id });
      }
    });
};
