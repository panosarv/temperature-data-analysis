import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react';

function AccessDenied() {
  return (
    <div className="w-full  flex flex-col justify-center items-center ">
    <Button className='absolute top-10 left-10 rounded-full bg-anthracite' variant='primary' onClick={()=>{window.location.href='/'}}><ChevronLeft className='text-white'/></Button>
    <img
      src="/img/access-denied.svg"
      alt="Weather Icon"
      className="w-1/3 h-auto" // Adjust size as needed
    />
    </div>
  );
}

export default AccessDenied;