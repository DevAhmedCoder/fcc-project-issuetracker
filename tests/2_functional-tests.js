const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let deleteID;
suite("Routing Tests", () => {
  // POST request

  suite("3 Post request Tests", () => {
    test("Create an issue with every field: POST request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .post("/api/issues/projectsTest")
        .set("content-type", "application/json")
        .send({
          issue_title: "testIssue",
          issue_text: "FtestIssue",
          created_by: "devAhmedcoder",
          assigned_to: "dev",
          status_text: "NOK",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          deleteID = res.body._id;
          assert.equal(res.body.issue_title, "testIssue");
          assert.equal(res.body.issue_text, "FtestIssue");
          assert.equal(res.body.created_by, "devAhmedcoder");
          assert.equal(res.body.assigned_to, "dev");
          assert.equal(res.body.status_text, "NOK");

          done();
        });
    });
    test("Create an issue with only required fields: POST request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .post("/api/issues/projectsTest")
        .set("content-type", "application/json")
        .send({
          issue_title: "testIssue",
          issue_text: "testIssue",
          created_by: "devAhmedcoder",
          assigned_to: "",
          status_text: "",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "testIssue");
          assert.equal(res.body.issue_text, "testIssue");
          assert.equal(res.body.created_by, "devAhmedcoder");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
    });
    test("Create an issue with missing required fields: POST request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .post("/api/issues/projectsTest")
        .set("content-type", "application/json")
        .send({
          issue_title: "",
          issue_text: "A",
          created_by: "A",
          assigned_to: "A",
          status_text: "A",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  // GET request

  suite("3 Get request Tests", () => {
    test("View issues on a project: GET request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .get("/api/issues/projectsTest")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 2);
          done();
        });
    });
    test("View issues on a project with one filter: GET request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .get("/api/issues/projectsTest")
        .query({
          issue_text: "FtestIssue",
        })

        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_title, "testIssue");
          assert.equal(res.body[0].issue_text, "FtestIssue");
          assert.equal(res.body[0].created_by, "devAhmedcoder");
          assert.equal(res.body[0].assigned_to, "dev");
          assert.equal(res.body[0].status_text, "NOK");
          done();
        });
    });
    test("View issues on a project with multiple filters: GET request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .get("/api/issues/projectsTest")
        .query({
          issue_title: "testIssue",
          issue_text: "testIssue",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_title, "testIssue");
          assert.equal(res.body[0].issue_text, "testIssue");
          assert.equal(res.body[0].created_by, "devAhmedcoder");
          assert.equal(res.body[0].assigned_to, "");
          assert.equal(res.body[0].status_text, "");
          done();
        });
    });
  });

  //  PUT request

  suite("5 Put request Tests", () => {
    test("Update one field on an issue: PUT request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .put("/api/issues/projectsTest")
        .send({
          _id: deleteID,
          issue_text: "update",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.include(res.body.result, "successfully updated");
          done();
        });
    });
    test("Update multiple fields on an issue: PUT request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .put("/api/issues/projectsTest")
        .send({
          _id: deleteID,
          issue_text: "update01",
          created_by: "devAhmedcoder",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.include(res.body.result, "successfully updated");
          done();
        });
    });
    test("Update an issue with missing _id: PUT request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .put("/api/issues/projectsTest")
        .send({
          issue_title: "update",
          issue_text: "update",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.include(res.body.error, "missing _id");

          done();
        });
    });
    test("Update an issue with no fields to update: PUT request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .put("/api/issues/projectsTest")
        .send({
          _id: deleteID,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.include(res.body.error, "no update field(s) sent");
          done();
        });
    });
    test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .put("/api/issues/projectsTest")
        .send({
          _id: "6230a0cf605945afa4c19a84",
          issue_title: "update",
          issue_text: "update",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.include(res.body.error, "could not update");
          done();
        });
    });
  });

  //  DELETE request

  suite("3 DELETE request Tests", () => {
    test("Delete an issue: DELETE request to /api/issues/projects", (done) => {
      chai
        .request(server)
        .delete("/api/issues/projectsTest")
        .send({
          _id: deleteID,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");

          done();
        });
    });
    test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .delete("/api/issues/projectsTest")
        .send({
          _id: "5fe0c500ec2f6f4c1815a770invalid",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.include(res.body.error, "could not delete");
          done();
        });
    });
    test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .delete("/api/issues/projectsTest")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.include(res.body.error, "missing _id");
          done();
        });
    });
  });
});
