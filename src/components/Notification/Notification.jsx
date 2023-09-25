import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeNotification } from "../../redux/viewSlice";

const Notification = (props) => {
    const { id, message, error } = props
    const dispatch = useDispatch()
    const [isVisible, setIsVisible] = useState(true)
    const [isPresent, setIsPresent] = useState(true)

    const extractMessage = () => {
        if(typeof message === 'string') {
            return message
        } else if (typeof message === 'object'){
            if(message.error) {
                return message.error
            }
        }
        return 'Error occured. Please check your server.'
    }

    useEffect(()=> {
        const timer = setTimeout(() => {
            setIsVisible(false);
          }, 3000);
      
          return () => clearTimeout(timer);
    },[])

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPresent(false);
            dispatch(removeNotification(id))
          }, 4000);
      
          return () => clearTimeout(timer);
    },[])
    
    if (isPresent) {
        return(
            <div>
                <div className={`flex flex-col items-end w-80 h-20 ${error ? 'bg-red-800' : 'bg-tree'} border border-black my-2 text-white rounded-sm ${
                    isVisible ? 'opacity-100' : 'opacity-0 animate__animated animate__fadeOutUp'
                    } transition-opacity duration-1000 ease-in-out`}>
                    <button onClick={()=>setIsPresent(false)} className="mr-3 font-bold text-sm text-opacity-60">x</button>
                    <div className={`w-full h-full flex pl-4 ml-3 text-md font-semibold `}>
                        {extractMessage(message)} 
                    </div>
                </div>
            </div>
        )
    }
}

export default Notification;