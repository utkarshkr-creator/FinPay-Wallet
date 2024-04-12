import { Button } from './button'
interface AppbarProps {
  user?: {
    name?: string | null;
  },
  onSignin: () => void,
  onSignout: () => void;
}

export const Appbar = ({
  user,
  onSignin,
  onSignout,
}: AppbarProps) => {
  return <div className="flex bg-stone-600 justify-between border-b px-4">
    <div className="text-3xl flex flex-col text-stone-100 justify-center">
      PayTM
    </div>
    <div className="flex flex-col justify-center pt-2">
      <Button onClick={user ? onSignout : onSignin}>{user ? "Logout" : "Login"}</Button>
    </div>
  </div>
}
