import Head from "next/head"
import { useRouter } from "next/router"

import { Formik, Form, Field } from "formik"

import axios from "axios"

import prisma from "@/lib/prisma/prisma"
import { NamespaceNameCreationSchema } from "@/lib/yup-schemas"

import "bootstrap/dist/css/bootstrap.min.css"
import Header from "@/components/Header"

export default function ProjectInvites(props) {
  const router = useRouter()
  const { namespaceName, projectName } = router.query

  console.log(props)
  const cancelInvite = (inviteId) => {
    console.log("deleting: ", inviteId)
    axios
      .delete(`/api/${namespaceName}/${projectName}/invites`, {
        data: {
          inviteId: inviteId
        }
      })
      .then((response) => {
        console.log("RESPONSE:", response)
        // TODO: Redirect to new project page
        // router.push("/")
      })
      .catch((error) => {
        console.log("ERROR:", error.response.data)
        console.log("ERROR:", error)
      })
  }

  return (
    <>
      <Head>
        <title>Invite Users</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="mt-5 pt-5" />

      <div className="container">
        <div className="d-flex justify-content-between">
          <h2>Invite a user (to project)</h2>
        </div>

        <hr />
      </div>

      <main className="container">
        <div className="row g-5">
          <div className="col-md-8">
            <article>
              <Formik
                initialValues={{
                  name: "",
                  role: "User"
                }}
                validationSchema={NamespaceNameCreationSchema}
                onSubmit={(values, { setSubmitting, setFieldError }) => {
                  axios
                    .post(`/api/${namespaceName}/${projectName}/invites`, {
                      name: values.name,
                      role: values.role
                    })
                    .then((response) => {
                      console.log("RESPONSE:", response)
                      // TODO: Redirect to new project page
                      // router.push("/")
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
                {({
                  errors,
                  isSubmitting
                }) => (
                  <Form>
                    <div className="row g-3 align-items-center mb-3">
                      <div className="col-5">
                        <label htmlFor="name" className="form-label">
                          Username
                        </label>
                        <Field
                          className="form-control"
                          type="text"
                          name="name"
                        />
                      </div>

                      <div className="col-auto h3 mt-5">/</div>

                      <div className="col-3">
                        <label htmlFor="role" className="form-label">
                          Role
                        </label>
                        <Field className="form-select" as="select" name="role">
                          <option value="User">User</option>
                          <option value="Owner">Owner</option>
                        </Field>
                      </div>
                    </div>

                    {errors.name && <div>{errors.name}</div>}
                    <hr />

                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={isSubmitting}
                    >
                      Invite User
                    </button>
                  </Form>
                )}
              </Formik>
            </article>
          </div>
        </div>

        <div>
          <div className="mb-4 mt-5">
            <h1>Outgoing Project Invites ({props.outgoingInvites.length})</h1>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">User</th>
                <th scope="col">Invited By</th>
                <th scope="col">Invited At</th>
                <th scope="col">Role</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {props.outgoingInvites.map((invite, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <a href={`/${invite.invitedUser.username}`}>
                      {invite.invitedUser.username}
                    </a>
                  </td>
                  <td>
                    <a href={`/${invite.inviteeUser.username}`}>
                      {invite.inviteeUser.username}
                    </a>
                  </td>
                  <td>{invite.createdAt}</td>
                  <td>{invite.role}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => cancelInvite(invite.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  const { namespaceName, projectName } = context.query
  const outgoingInvites = await prisma.memberInvitation.findMany({
    where: {
      project: {
        name: projectName,
        namespace: {
          name: namespaceName
        }
      }
    },
    select: {
      id: true,
      role: true,
      createdAt: true,
      invitedUser: {
        select: {
          username: true
        }
      },
      inviteeUser: {
        select: {
          username: true
        }
      }
    }
  })
  console.log(outgoingInvites)

  const mapped = outgoingInvites.map((e) => {
    return {
      ...e,
      createdAt: e.createdAt.toISOString()
    }
  })

  return {
    props: {
      outgoingInvites: mapped
    }
  }
}
