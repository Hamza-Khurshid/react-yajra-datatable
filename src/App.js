import './App.css';
import Datatable from './datatable';
import MaterialTable from './materialtable';

const URL = "http://a23514422d3c.ngrok.io/api/user"

function App() {

  const columns = [
    { id: 'id', label: 'ID', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 200 }
  ];

  return (
    <div className="App">
        {/* <Datatable
          url={URL}
          columns={[
              { name: 'ID', data: 'id' },
              { name: 'Name', data: 'name' },
              { name: 'Email', data: 'email', html: true },
          ]}
        /> */}

        <MaterialTable url={URL} columns={[
          { id: 'id', label: 'ID', minWidth: 100 },
          { id: 'name', label: 'Name', minWidth: 170 },
          { id: 'email', label: 'Email', minWidth: 200 }
        ]} />
    </div>
  );
}

export default App;
