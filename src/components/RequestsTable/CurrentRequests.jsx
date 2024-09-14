import { currentRequests } from './dummyData';
import RequestsTable from './RequestsTable';

function CurrentRequests() {

    return <RequestsTable data={currentRequests} title="Current Requests" isPrevious={false} />;


}

export default CurrentRequests