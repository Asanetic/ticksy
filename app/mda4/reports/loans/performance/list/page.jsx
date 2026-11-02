import { Suspense } from 'react';
import LoansPerformanceList from '../uiControl/LoansPerformanceList';
import { LoansPerformanceSchema } from '../LoansPerformanceSchema';
import { hiveRoutes } from '../../../../../appConfigs/hiveRoutes';

export async function generateMetadata() {
  return { title: LoansPerformanceSchema.label, description: LoansPerformanceSchema.description, icons: { icon: `${hiveRoutes.hiveBaseRoute}/logo.png` } };
}

export default function Page() {
  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content container-fluid p-0 m-0 ">
          <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
            <LoansPerformanceList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
