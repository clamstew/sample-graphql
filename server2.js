const express = require("express");
const express_graphql = require("express-graphql");
const { buildSchema } = require("graphql");
const fetch = require("node-fetch");
// GraphQL schema
const schema = buildSchema(`
  type Query {
    course(id: Int!): Course
    courses(topic: String): [Course]
  },
  type Course {
    id: Int
    title: String
    author: String
    description: String
    topic: String
    url: String
  }
`);

const getAllCourses = () =>
  fetch(
    "https://gist.githubusercontent.com/clamstew/9e88827a4d1eec9e3e035fb31d54bfb7/raw/917bfb6580d916ed107999be9d472f590ac19e25/sample-books.json"
  ).then(result => result.json());

async function getCourse({ id }) {
  const coursesData = await getAllCourses();
  return coursesData.filter(course => course.id == id)[0];
}

async function getCourses({ topic }) {
  const coursesData = await getAllCourses();
  if (topic) {
    return coursesData.filter(course => course.topic === topic);
  } else {
    return coursesData;
  }
}

const root = {
  course: getCourse,
  courses: getCourses
};

// Create an express server and a GraphQL endpoint
const app = express();
app.use(
  "/graphql",
  express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(4000, () =>
  console.log("Express GraphQL Server Now Running On localhost:4000/graphql")
);
