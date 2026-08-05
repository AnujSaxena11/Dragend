import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home.jsx'
import Contact from './Components/Contact/Contact.jsx'
import Workspace from './Components/Workspace/Workspace.jsx';
import { DragEndCreateFlow } from './Components/CreateProject/flow/DragendCreateFlow.jsx';
import Auth from './Components/Auth/Auth.jsx';
import UserGuide from './Components/Workspace/UserGuide.jsx'
import Explore from './Components/Explore/Explore.jsx';
import { ProfilePage } from './Components/Profile/ProfilePage.jsx';
import { PublicProfilePage } from './Components/Profile/PublicProfilePage.jsx';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/:projectId/workflow" element={<Workspace />} />
        <Route path="/new" element={<DragEndCreateFlow />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/user-guide" element={<UserGuide />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:username" element={<PublicProfilePage />} />
      </Routes>
    </Router>
  )
}

export default App;
