import { Suspense } from 'react';
import OrganisersList from '../uiControl/OrganisersList';
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';


export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Organisers"//searchParams?.mosyTitle || "Tasks";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Organisers`,
    description: 'supercrm Tasks',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function Page() {

return (
     <>
        <div className="main-wrapper">
          <div className="page-wrapper">
            <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <OrganisersList />
               </Suspense>
            </div>
          </div>
        </div>
    </>
)
}
