import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
  function UploadTooltip() {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className='rounded-full m-1 w-0.5 h-6'>i</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload an csv file containing the data reported from the Australian Government
              Bureau of Meteorology for Mean Maximum Temperature Climate Data.
              </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
 export default UploadTooltip
