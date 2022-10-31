import AuthLinks from '~/components/auth-links'
import SignOutButton from '~components/sign-out-button'

export default function Home(): JSX.Element {
  return (
    <>
      <h1>Hello, World!</h1>
      <AuthLinks />
      <SignOutButton />
    </>
  )
}
