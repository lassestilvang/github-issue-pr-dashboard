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
      session.accessToken = token.accessToken as string
      // Fetch GitHub user login if not already present
      if (token.accessToken && !session.user?.login) {
        try {
          const response = await fetch('https://api.github.com/user', {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          })
          if (response.ok) {
            const userData = await response.json()
            session.user.login = userData.login
          }
        } catch (error) {
          console.error('Failed to fetch GitHub user data:', error)
        }
      }
      return session
    },
  },
})