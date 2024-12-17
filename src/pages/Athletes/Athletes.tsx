import {useContext} from 'react'
import './Athletes.css'
import CreateAthlete from './CreateAthlete';
import AtheleteItem from './AthleteItem';
import { UserContext } from '../../contexts/UserContext';
import { AppContext } from '../../contexts/AppContext';


export default function Athletes() {
  const {athletes} = useContext(AppContext);
  const { user} = useContext(UserContext); 

  return (
    <div className="athlete-page-container">
      {/* Create Athlete Section (Admin Only) */}
      {user?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === "Admin" && (
        <div className="create-athlete-section">
          <h1>Create Athlete</h1>
          <CreateAthlete />
        </div>
      )}

      {/* Athlete List Section (Visible to All) */}
      <div className="athlete-list-section">
        <h1>Athlete List</h1>
        <div className="athlete-list">
          {athletes.map((athlete, index) => (
            <AtheleteItem key={index} athlete={athlete} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
