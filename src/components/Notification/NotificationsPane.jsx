import { useSelector } from "react-redux";
import Notification from "./Notification";
import { useEffect, useState } from "react";
import { convertToList } from "../../utils/parkingUtils";

const NotificationsPane = () => {
    const view = useSelector(state => state.view)
    const [notifications, setNotifications] = useState([])


    useEffect(() => {
        const updateNotificationsToShow = () => {
           const notificationsInListFormat= convertToList(view.notifications)
           setNotifications(notificationsInListFormat)
        }
        updateNotificationsToShow()
    },[view.notifications])

    return (
        <div className="fixed  bottom-10 right-20 bg-transparent w-80 h-fit">
            {notifications && notifications.map(obj => (
                <div>
                    <Notification
                        id={obj.id}
                        error={obj.error}
                        message={obj.message}
                    />
                </div>
            ))}
        </div>
    )
}

export default NotificationsPane;