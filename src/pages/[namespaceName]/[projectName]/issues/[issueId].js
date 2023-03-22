import Head from "next/head"
import { useRouter } from "next/router"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Formik, Form, Field } from "formik"
import { IssueCreationSchema } from "@/lib/yup-schemas"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLock,
  faEllipsis,
  faThumbTack,
  faTrash,
  faGear
} from "@fortawesome/free-solid-svg-icons"

import prisma from "@/lib/prisma/prisma"
import axios from "axios"

import "bootstrap/dist/css/bootstrap.min.css"

export default function IssuesView(props) {

  const router = useRouter()
  const { namespaceName, projectName, issueId } = router.query

  const issue = props.issuesData
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
          {issue.open && (
            <>
              <span className="badge bg-success">Open</span>Opened January 1,
              2021 by <a href="#">Yzma</a>
            </>
          )}
          {!issue.open && (
            <>
              <span className="badge bg-danger">Closed</span>Closed January 1,
              2021 by <a href="#">Yzma</a>
            </>
          )}
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

            {/* comments: [
    {
      id: 'clfiwk5j9000fqqi8u4pi428b',
      description: '# Comment',
      createdAt: '2023-03-21T23:26:45.985Z',
      updatedAt: '2023-03-21T23:26:45.985Z',
      userId: 'clfiwhw4q0000qqi8h4bfk9nx',
      issueId: 'clfivxk2p001sqq8cznh3p7ur'
    } */}
            {issue.comments.map((comment, index) => (
              <div key={index} className="card mb-5">
                <div className="card-header d-flex justify-content-between align-items-center">
                  {comment.id} commented {comment.createdAt}(26 minutes ago){" "}
                  <FontAwesomeIcon className="mr-4" icon={faEllipsis} />
                </div>
                <div className="card-body">
                  
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {comment.description}
                    </ReactMarkdown>
                
                </div>
              </div>
            ))}

            <Formik
              initialValues={{
                description: ""
              }}
              // validationSchema={IssueCreationSchema}
              onSubmit={(values, { setSubmitting, setFieldError }) => {
                axios
                  .post(`/api/${namespaceName}/${projectName}/comments`, {
                    issueId: issueId,
                    description: values.description
                  })
                  .then((response) => {
                    console.log("RESPONSE:", response)
                    // TODO: Render to the screen - don't refresh the page
                  })
                  .catch((error) => {
                    console.log("ERROR:", error.response.data)
                    console.log("ERROR:", error)
                  })
                  .finally(() => {
                    setSubmitting(false)
                  })
              }}
            >
              {({ errors, isSubmitting }) => (
                <Form>
                  {(errors.name || errors.description || errors.private) && (
                    <div className="alert alert-danger" role="alert">
                      <ul>
                        {errors.description && (
                          <li>Description: {errors.description}</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="card mb-5">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      Write a comment
                    </div>
                    <div className="card-body">
                      <Field
                        className="form-control"
                        type="textarea"
                        as={"textarea"}
                        name="description"
                        rows="3"
                      />
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isSubmitting}
                      >
                        Create Issue
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className="col-md-4">
            <div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary h5">Asignees </span>
                <FontAwesomeIcon
                  className="mr-4 align-self-center align-middle"
                  icon={faGear}
                />
              </div>
              <a>Yzma</a>
            </div>

            <hr />

            <div>
              <div className="d-flex justify-content-between align-self-center">
                <span className="text-secondary h5">Labels </span>
                <FontAwesomeIcon
                  className="mr-4 align-self-center align-middle"
                  icon={faGear}
                />
              </div>
              <span className="badge bg-primary">Label 1</span>{" "}
              <span className="badge bg-warning">Label 2</span>
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
  const { namespaceName, projectName, issueId } = context.query

  console.log("issueId", issueId)
  const issuesData = await prisma.issue.findFirst({
    where: {
      id: issueId
    },

    include: {
      labels: true,
      comments: true
    }
  })

  console.log(issuesData)

  if (!issuesData) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const mappedComments = issuesData.comments.map(e => {
    return {
      ...e,
      createdAt: issuesData.createdAt.toISOString(),
      updatedAt: issuesData.updatedAt.toISOString()
    }
  }) 

  return {
    props: {
      issuesData: {
        ...issuesData,
        comments: mappedComments,
        createdAt: issuesData.createdAt.toISOString(),
        updatedAt: issuesData.updatedAt.toISOString()
      }
    }
  }
}
