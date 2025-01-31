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
      .get("/api/articles?limit=20")
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
  test("200: Responds with article objects sorted by date and in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ key: "created_at", descending: true });
      });
  });
  test("200: Responds with article objects sorted according to value of sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ key: "votes", descending: true });
      });
  });
  test("200: Responds with article objects ordered according to value of order query", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ key: "created_at" });
      });
  });
  test("200: Responds with article objects filtered according to value of topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch&limit=20")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("200: Responds with article objects paginated with default limit of 10 per page", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
      });
  });
  test("200: Responds with article objects paginated according to value of limit query", () => {
    return request(app)
      .get("/api/articles?limit=6")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(6);
      });
  });
  test("200: Responds with correct page of article objects according to value of limit and page query", () => {
    return request(app)
      .get("/api/articles?limit=3&p=3&sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(3);
        articles.forEach((article, index) => {
          expect(article.article_id).toBe(7 + index);
        });
      });
  });
  test("200: Responds with total_count property displaying correct total number of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { total_count } }) => {
        expect(total_count).toBe(13);
      });
  });
  test("200: Total count property takes into account any filtering queries", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { total_count } }) => {
        expect(total_count).toBe(12);
      });
  });
  test("400: Responds with appropriate error message when invalid sort query values", () => {
    return request(app)
      .get("/api/articles?order=ascendingg&sort_by=123")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Invalid query values");
      });
  });
  test("400: Responds with appropriate error message when invalid page query values", () => {
    return request(app)
      .get("/api/articles?limit=five&p=one")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Invalid query values");
      });
  });
  test("404: Responds with appropriate error message when nonexistent topic", () => {
    return request(app)
      .get("/api/articles?topic=123")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Topic not found");
      });
  });
  test("404: Responds with appropriate error message when requested page has no content", () => {
    return request(app)
      .get("/api/articles?p=3")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Page not found");
      });
  });
});

describe("POST /api/articles", () => {
  test("201: Responds with the posted article", () => {
    const newArticle = {
      author: "lurker",
      title: "Latest stuff",
      body: "This is a new article...",
      topic: "mitch",
      article_img_url: "https://coolimages.com/1242213",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          author: "lurker",
          title: "Latest stuff",
          body: "This is a new article...",
          topic: "mitch",
          article_img_url: "https://coolimages.com/1242213",
          created_at: expect.any(String),
          votes: 0,
          comment_count: 0,
        });
      });
  });
  test("201: Article image URL defaults to null if not provided", () => {
    const newArticle = {
      author: "lurker",
      title: "More latest stuff",
      body: "This is also a new article...",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article.article_img_url).toBe(null);
      });
  });
  test("404: Responds with appropriate error message when nonexistent topic", () => {
    const newArticle = {
      author: "lurker",
      title: "Even more latest stuff",
      body: "This wanted to be a new article...",
      topic: 123,
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Topic not found");
      });
  });
  test("401: Responds with appropriate error message when author isn't a current user", () => {
    const newArticle = {
      author: 123,
      title: "Loads more latest stuff",
      body: "This had hoped to be a new article...",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(401)
      .then(({ body: { error } }) => {
        expect(error).toBe("Unable to identify user");
      });
  });
  test("400: Responds with appropriate error message when request body is incomplete", () => {
    const newArticle = {
      body: "This was, at one point, a new article...",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Bad request");
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
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: expect.any(String),
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: Article response object includes comment count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe(11);
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

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with updated article object", () => {
    const update = { inc_votes: 6 };
    return request(app)
      .patch("/api/articles/5")
      .send(update)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: expect.any(String),
          votes: 6,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: Votes are incremented correctly when there are preexisting votes", () => {
    const update = { inc_votes: -20 };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(80);
      });
  });
  test("404: Responds with appropriate error message when nonexistent article id", () => {
    const update = { inc_votes: -3 };
    return request(app)
      .patch("/api/articles/9000")
      .send(update)
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Article not found");
      });
  });
  test("400: Responds with appropriate error message when invalid article id", () => {
    const update = { inc_votes: 2 };
    return request(app)
      .patch("/api/articles/banana")
      .send(update)
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Bad request");
      });
  });
  test("400: Responds with appropriate error message when request body does not have inc_votes property", () => {
    const update = { inccc_votes: 6 };
    return request(app)
      .patch("/api/articles/4")
      .send(update)
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Bad request");
      });
  });
  test("400: Responds with appropriate error message when value of inc_votes has invalid syntax", () => {
    const update = { inc_votes: "seven" };
    return request(app)
      .patch("/api/articles/4")
      .send(update)
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
            article_id: 3,
          });
        });
      });
  });
  test("200: Responds with comments sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=15")
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
  test("200: Responds with comments paginated with default limit of 10 per page", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(10);
      });
  });
  test("200: Responds with comments paginated according to value of limit query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=2")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(2);
      });
  });
  test("200: Responds with correct page of comments according to value of limit and page query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=3&p=2")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(3);
        const expectedCommentIds = [13, 7, 8];
        comments.forEach((comment, index) => {
          expect(comment.comment_id).toBe(expectedCommentIds[index]);
        });
      });
  });
  test("200: Responds with total_count property displaying correct total number of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { total_count } }) => {
        expect(total_count).toBe(11);
      });
  });
  // test("200: Total count property takes into account any filtering queries", () => {
  //   return request(app)
  //     .get("/api/articles/1/comments?author=lurker")
  //     .expect(200)
  //     .then(({ body: { total_count } }) => {
  //       expect(total_count).toBe(2);
  //     });
  // });
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
  test("404: Responds with appropriate error message when requested page (other than page 1) has no content", () => {
    return request(app)
      .get("/api/articles/3/comments?p=3")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Page not found");
      });
  });
  test("400: Responds with appropriate error message when invalid page query values", () => {
    return request(app)
      .get("/api/articles/2/comments?limit=five&p=one")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Invalid query values");
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
  test("401: Responds with appropriate error message when username doesn't belong to a current user", () => {
    const newComment = {
      username: 123,
      body: "This is also a new comment...",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(newComment)
      .expect(401)
      .then(({ body: { error } }) => {
        expect(error).toBe("Unable to identify user");
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

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Responds with updated comment object", () => {
    const update = { inc_votes: 7 };
    return request(app)
      .patch("/api/comments/5")
      .send(update)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 5,
          body: "I hate streaming noses",
          article_id: 1,
          author: "icellusedkars",
          votes: 7,
          created_at: expect.any(String),
        });
      });
  });
  test("200: Votes are incremented correctly when there are preexisting votes", () => {
    const update = { inc_votes: -10 };
    return request(app)
      .patch("/api/comments/1")
      .send(update)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(6);
      });
  });
  test("404: Responds with appropriate error message when nonexistent comment id", () => {
    const update = { inc_votes: -3 };
    return request(app)
      .patch("/api/comments/9000")
      .send(update)
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Comment not found");
      });
  });
  test("400: Responds with appropriate error message when invalid comment id", () => {
    const update = { inc_votes: 2 };
    return request(app)
      .patch("/api/comments/banana")
      .send(update)
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Bad request");
      });
  });
  test("400: Responds with appropriate error message when request body does not have inc_votes property", () => {
    const update = {};
    return request(app)
      .patch("/api/comments/4")
      .send(update)
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Bad request");
      });
  });
  test("400: Responds with appropriate error message when value of inc_votes has invalid syntax", () => {
    const update = { inc_votes: "seven" };
    return request(app)
      .patch("/api/comments/4")
      .send(update)
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes comment from database", () => {
    return (
      request(app)
        .delete("/api/comments/5")
        .expect(204)
        //Just receiving a 204 status code response is proof enough that the comment has been deleted
        // in the context of our integration tests, as it means that the model has been invoked successfully
        .then(() => {
          const sql = "SELECT * FROM comments WHERE comment_id = 5;";
          return db.query(sql);
        })
        .then(({ rows }) => {
          expect(rows.length).toBe(0);
        })
    );
  });
  test("404: Responds with appropriate error message when nonexistent comment id", () => {
    return request(app)
      .delete("/api/comments/500")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Comment not found");
      });
  });
  test("400: Responds with appropriate error message when invalid comment id", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Responds with user object with correct username and properties", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: "lurker",
          name: "do_nothing",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        });
      });
  });
  test("404: Responds with appropriate error message when nonexistent username", () => {
    return request(app)
      .get("/api/users/nonexistent")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Username not found");
      });
  });
});
