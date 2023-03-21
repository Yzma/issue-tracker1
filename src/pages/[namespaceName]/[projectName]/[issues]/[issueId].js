import Head from "next/head"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLock,
  faEllipsis,
  faThumbTack,
  faTrash
} from "@fortawesome/free-solid-svg-icons"

import "bootstrap/dist/css/bootstrap.min.css"

export default function IssuesView(props) {
  const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done
`

  const issue = props.issuesData[0]
  console.log(issue)
  return (
    <>
      <Head>
        <title>Create Issues</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mt-5" />

      <div className="container">
        <div className="d-flex justify-content-between">
          <h2>{issue.name}</h2>

          <button type="button" className="btn btn-secondary">
            Edit
          </button>
        </div>

        <p>
          {issue.open && <>
            <span className="badge bg-success">Open</span>Opened January 1, 2021 by <a href="#">Yzma</a>
          </>}
          {!issue.open && <>
            <span className="badge bg-danger">Closed</span>Closed January 1, 2021 by <a href="#">Yzma</a>
          </>}

        </p>
        <hr />
      </div>

      <main className="container">
        <div className="row g-5">
          <div className="col-md-8">
            <article>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {issue.description}
              </ReactMarkdown>
            </article>

            <hr />

            <div className="card">
              <div className="card-header d-flex justify-content-between">
                Yzma commented 26 minutes ago{" "}
                <FontAwesomeIcon className="mr-4" icon={faEllipsis} />
              </div>
              <div className="card-body">
                <p className="card-text">Comment body here</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div>
              <span className="text-secondary h5">Asignees</span>
              <br />
              <a>Yzma</a>
            </div>

            <hr />

            <div>
              <span className="text-secondary h5">Labels</span>
              <br />
              <span className="badge bg-primary">Label 1</span>{" "}
              <span className="badge bg-warning">Label 2</span>
            </div>

            <hr />

            <div>
              <span className="text-secondary h5">Participants</span>
              <br />
              <a>Yzma</a>
            </div>

            <hr />

            <div>
              <FontAwesomeIcon className="mr-4" icon={faLock} />
              <a href="#">Close Issue</a>
            </div>

            <div>
              <FontAwesomeIcon className="mr-4" icon={faThumbTack} />
              <a href="#">Pin Issue</a>
            </div>

            <div>
              <FontAwesomeIcon className="mr-4" icon={faTrash} />
              <a href="#">Delete Issue</a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps(context) {

  const { namespaceName, projectName, issueNumber } = context.query

  const issuesData = await prisma.issue.findMany({
    where: {
      issueNumber: 4
    },

    include: {
      labels: true,
    },
  });

  return {
    props: {
      issuesData: issuesData.map((issue) => ({
        ...issue,
        createdAt: issue.createdAt.toISOString(),
        updatedAt: issue.updatedAt.toISOString(),
      })),
    },
  };
}
