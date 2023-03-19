import prisma from "@/lib/prisma/prisma"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

import { setCookie } from "cookies-next"
import { NEW_USER_COOKIE, NEXT_AUTH_SESSION_COOKIE } from "@/lib/constants"

import { decryptJwt } from "@/lib/jwt"
import { NamespaceNameCreationSchema } from "@/lib/yup-schemas"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const cookie = req.cookies["new-user-cookie"]

    if (!cookie) {
      return res.status(400).json({ error: "Request did not have cookie" })
    }

    const { name } = req.body

    let token
    try {
      token = await decryptJwt(cookie)
    } catch (e) {
      return res
        .status(400)
        .json({ error: "Error decoding provided JSON token" })
    }

    if (!token) {
      return res
        .status(400)
        .json({ error: "Error decoding provided JSON token" })
    }

    try {
      NamespaceNameCreationSchema.validate({ name })
    } catch (e) {
      return res.status(400).json({ error: "Invalid name" })
    }

    const options = token.payload.session.options
    setCookie(NEXT_AUTH_SESSION_COOKIE, token.payload.session.value, { req, res, options })
    const session = await getServerSession(req, res, authOptions(req, res))
    if (!session) {
      setCookie(NEXT_AUTH_SESSION_COOKIE, "", { req, res, maxAge: -1 })
      return res.status(400).json({ error: "Invalid session" })
    }

    console.log("Session", JSON.stringify(session, null, 2))

    // if (true) {
    //   console.log(token)
    //   console.log()
    //   console.log("Stringify", JSON.stringify(token))
    //   const options = token.payload.session.options
    //   setCookie(NEXT_AUTH_SESSION_COOKIE, token.payload.session.value, { req, res, options })
    //   setCookie(NEW_USER_COOKIE, "", { req, res, maxAge: -1 })
    //   console.log("Are we here?")
    //   return res.status(200).json({ error: "success" })
    // }

    return prisma.namespace
      .create({
        data: {
          name,
          userId: session.user.id
        }
      })
      .then((result) => {
        console.log("API RESULT: ", result)
        // setCookie(NEXT_AUTH_SESSION_COOKIE, decoded.session, { req, res })
        // setCookie(NEW_USER_COOKIE, "", { req, res, maxAge: -1 })
        const options = token.payload.session.options
        // setCookie(NEXT_AUTH_SESSION_COOKIE, token.payload.session.value, { req, res, options })
        setCookie(NEW_USER_COOKIE, "", { req, res, maxAge: -1 })
        console.log("Are we here?")
        return res.redirect("/")
      })
      .catch((err) => {
        // TODO: Check individual error codes from prisma. Check if the name already exists, if the user already has a namespace, etc
        console.log("error: ", err)
        return res
          .status(400)
          .json({ error: "Error creating entry in database" })
      })
  } else {
    res.json({ error: "Not supported" })
  }
}
