const mongoose = require("mongoose");
const { Types } = require("mongoose");

const { Schema } = mongoose;

const issue = new Schema(
  {
    issue_title: {
      type: String,
      required: true,
    },
    issue_text: {
      type: String,
      required: true,
    },
    created_by: {
      type: String,
      required: true,
    },
    assigned_to: {
      type: String,
      default: "",
    },
    status_text: {
      type: String,
      default: "",
    },
    open: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_on", updatedAt: "updated_on" } }
);
const Issue = mongoose.model("Issue", issue);
const project = new Schema({
  name: { type: String, required: true },
  issues: [{ type: Types.ObjectId, ref: "Issue", required: true }],
});

const Project = mongoose.model("Project", project);

exports.Issue = Issue;
exports.Project = Project;
