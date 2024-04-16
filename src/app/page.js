// import Login from './login/page';

// const Home = () => {
  

//   return (
//     <Login/>
//   );
// };

// export default Home;
import Task from "./tasks/page";
 
export default async function Home() {
 
  return (
    <div className="h-screen">
     
      <Task/>
    </div>
  )
}