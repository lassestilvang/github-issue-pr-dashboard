import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'repo read:user user:email'
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session as any).accessToken = token.accessToken as string
      // Fetch GitHub user login if not already present
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (token.accessToken && !(session.user as any)?.login) {
        try {
          const response = await fetch('https://api.github.com/user', {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          })
          if (response.ok) {
            const userData = await response.json()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const user = session.user as any
            user.login = userData.login
          }
        } catch (error) {
          console.error('Failed to fetch GitHub user data:', error)
        }
      }
      return session
    },
  },
})