import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Formik, Form, Field } from 'formik'
import axios from 'axios'
import Header from '@/components/Header'
import ProjectBelowNavbar from '@/components/navbar/ProjectBelowNavbar'

import { NamespaceNameCreationSchema } from '@/lib/yup-schemas'

export default function ProjectInvites() {
  const router = useRouter()
  const { namespaceName, projectName } = router.query

  const [response, setResponse] = useState<{
    error?: string
    success?: string
  }>({})
  return (
    <>
      <Head>
        <title>Invite Users</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header />
          <ProjectBelowNavbar
            namespaceName={namespaceName}
            projectName={projectName}
            selected="invites"
          />
          <main>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow">
                    <div className="p-6 space-y-6">
                      <section>
                        <h2 className="text-3xl leading-snug text-slate-800 font-bold mb-1">
                          Invite a user to join {projectName}
                        </h2>
                        <div className="">
                          <Formik
                            initialValues={{
                              name: '',
                            }}
                            validateOnChange={false}
                            validateOnBlur={false}
                            validationSchema={NamespaceNameCreationSchema}
                            onSubmit={(
                              values,
                              { setSubmitting, setFieldError }
                            ) => {
                              axios
                                .post(
                                  `/api/${namespaceName}/${projectName}/invites`,
                                  {
                                    name: values.name,
                                    // role: values.role // TODO: Assign role when inviting
                                  }
                                )
                                .then((response) => {
                                  console.log('RESPONSE:', response)
                                  setResponse({
                                    success: `You have invited ${values.name}!`,
                                  })
                                  // TODO: Redirect to new project page
                                  // router.push("/")
                                })
                                .catch((error) => {
                                  console.log('ERROR:', error.response.data)
                                  console.log(
                                    'ERROR:',
                                    error.response.data.error
                                  )
                                  if (error.response.data.error === 'P2002') {
                                    setResponse({
                                      error: 'That user was already invited!',
                                    })
                                  } else {
                                    setResponse({
                                      error: 'That user does not exist',
                                    })
                                  }
                                })
                                .finally(() => {
                                  setSubmitting(false)
                                })
                            }}
                          >
                            {({
                              values,
                              errors,
                              isSubmitting,
                              touched,
                              setFieldError,
                            }) => (
                              <Form
                                onChange={() =>
                                  setFieldError('name', undefined)
                                }
                              >
                                {response && response.error && (
                                  <div className="py-3">
                                    <div className="flex w-1/3 px-4 py-2 rounded-sm text-sm border bg-rose-100 border-rose-200 text-rose-600">
                                      <div>{response.error}</div>
                                    </div>
                                  </div>
                                )}

                                {response && response.success && (
                                  <div className="py-3">
                                    <div className="flex w-1/3 px-4 py-2 rounded-sm text-sm border bg-emerald-100 border-emerald-200 text-emerald-600">
                                      <div>{response.success}</div>
                                    </div>
                                  </div>
                                )}

                                <section className="flex flex-row mb-4 gap-x-4">
                                  <div className="sm:w-1/3">
                                    <label
                                      className="block text-sm font-medium mb-1"
                                      htmlFor="name"
                                    >
                                      Username{' '}
                                      <span className="text-rose-500">*</span>
                                    </label>
                                    <Field
                                      className="form-input w-full"
                                      type="text"
                                      name="name"
                                    />
                                  </div>

                                  <div className="w-1/6">
                                    <label
                                      className="block text-sm font-medium mb-1"
                                      htmlFor="owner"
                                    >
                                      Role{' '}
                                      <span className="text-rose-500">*</span>
                                    </label>

                                    <Field
                                      className="form-input w-full "
                                      as="select"
                                      name="role"
                                    >
                                      <option value="User">User</option>
                                      <option value="Owner">Owner</option>
                                    </Field>
                                  </div>
                                </section>

                                {/* {errors.name && (
                                  <div>Name errors:{errors.name}</div>
                                )} */}

                                <hr />

                                <div className="flex flex-col py-5 border-t border-slate-200">
                                  <div className="flex self-start">
                                    <button
                                      className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                                      type="submit"
                                      disabled={isSubmitting}
                                    >
                                      Invite User
                                    </button>
                                  </div>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
