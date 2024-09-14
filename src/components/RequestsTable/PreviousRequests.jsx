import { previousRequests } from './dummyData';
import RequestsTable from './RequestsTable';

function PreviousRequests() {

    return <RequestsTable data={previousRequests} title="Previous Requests" isPrevious={true} />;

}

export default PreviousRequests;
