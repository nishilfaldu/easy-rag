import { UserProfile } from "@clerk/nextjs";
import NavBar from "../_components/NavBar";



export default function SettingsProfilePage() {
  return (
    <>
      <NavBar></NavBar>
      <div className="flex-center justify-center content-center">
      <br></br>    
      <UserProfile/>
      </div>
    </>

  );
}