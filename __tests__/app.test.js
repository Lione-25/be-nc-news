const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const app = require("../app");
const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("nonexistent endpoint", () => {
  test("Responds with status 404 and appropriate error message", () => {
    return request(app)
      .get("/api/nope")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Endpoint not found");
      });
  });
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects without a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
          expect(article.hasOwnProperty("body")).toBe(false);
        });
      });
  });
  test("200: Responds with article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ key: "created_at", descending: true });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with article object with correct article id and properties", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 3,
          author: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: Responds with appropriate error message when nonexistent article id", () => {
    return request(app)
      .get("/api/articles/9000")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Article not found");
      });
  });
  test("400: Responds with appropriate error message when invalid article id", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comment objects", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: Responds with comments sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
        expect(comments).toBeSorted({ key: "created_at", descending: true });
      });
  });
  test("200: Responds with empty array when article has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(0);
      });
  });
  test("404: Responds with appropriate error message when nonexistent article id", () => {
    return request(app)
      .get("/api/articles/90/comments")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Article not found");
      });
  });
  test("400: Responds with appropriate error message when invalid article id", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment", () => {
    const newComment = {
      username: "lurker",
      body: "This is a new comment...",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "lurker",
          body: "This is a new comment...",
          article_id: 3,
        });
      });
  });
  test("404: Responds with appropriate error message when nonexistent article id", () => {
    const newComment = {
      username: "rogersop",
      body: "This had hoped to be a new comment...",
    };
    return request(app)
      .post("/api/articles/90/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Article not found");
      });
  });
  test("404: Responds with appropriate error message when nonexistent username", () => {
    const newComment = {
      username: 123,
      body: "This is also a new comment...",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Username not found");
      });
  });
  test("400: Responds with appropriate error message when invalid article id", () => {
    const newComment = {
      username: "lurker",
      body: "This would have been a new comment...",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Bad request");
      });
  });
  test("400: Responds with appropriate error message when request body is incomplete", () => {
    const newComment = {
      body: "This was, at one point, a new comment...",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Bad request");
      });
  });
});
