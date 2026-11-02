import { Suspense } from 'react';

import ImportCSVComponent from '../../import/uploadData';
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';
import { TickettypesSchema } from '../TickettypesSchema';

const apiRoutes = getApiRoutes()

export async function generateMetadata({ searchParams }) {
  const mosyTitle = 'Import Tickettypes data ';

  return {
    title: mosyTitle ,
    description: 'Import csv data',
    
    icons: {
        icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}
                      

export default function UploadCsvPage() {

   const colsArray = TickettypesSchema.exportColumns
 
   const idKey = TickettypesSchema.fields[1]?.key || 'record_id';
   const idAlias = TickettypesSchema.excel_import_record_id_alias;

   return (
     <>
       <div className='main-wrapper'>
          <div className='page-wrapper'>
             <div className='content container-fluid p-0 m-0'>
              <div className='p-3'>
               <Suspense fallback={<div className='col-md-12 p-5 text-center h3'>Loading...</div>}>
               {/* <ImportCSVComponent
                colsArray={colsArray}
                 title='Import Tickettypes data ' 
                 endpoint={TickettypesSchema.importDataEndpoint} 
                 templateName={`import_Tickettypes_data__template.csv`}/>
    */}
                <ImportCSVComponent
                  colsArray={colsArray}
                  idKey={idKey}
                  idAlias={idAlias}
                  title='Import Tickettypes data ' 
                  endpoint={TickettypesSchema.importDataEndpoint}
                  templateName={`import_Tickettypes_data__template.csv`}
                />



              </Suspense>
            </div>
             </div>
           </div>
         </div>
       </>
     );
}