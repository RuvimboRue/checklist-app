import { currentUser } from '@clerk/nextjs';
 
export default async function User() {
  const user = await currentUser();
 
  if (!user) return <div>Not signed in</div>;
  return (
    <div className="h-screen">
     <div>Changed by:  {user?.firstName}</div>
    </div>
  )
}