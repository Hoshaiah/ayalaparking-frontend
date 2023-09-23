
export const calculateHourDifference = (dateString1, dateString2) => {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    if (date2 < date1) {
       return -1 
    }

    const differenceInMilliseconds = Math.abs(date2 - date1);
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

    return differenceInHours;
}

export const calculateParkingCost = (hours, parkingSize) => {
    const parkingPrices = {
        small: 20,
        medium: 60,
        large: 100
    }
    let costBreakdown = {}
    let runningHour = hours
    if(runningHour <= 3) {
         costBreakdown = {
             flatHours: Math.ceil(runningHour),
             flatHourTotal: 40,

             total: 40,
             totalHours: Math.round(hours*100)/100
         }
         return costBreakdown
    } 
    if(hours <= 24) {
        runningHour -= 3
        const continuousTotal = Math.ceil(runningHour) * parkingPrices[parkingSize]
        costBreakdown = {
            flatHours: 3,
            flatHourTotal: 40,

            continuousHours: Math.ceil(runningHour),
            continuousTotal: continuousTotal,

            parkingSize: parkingSize,
            total: 40 + continuousTotal,
            totalHours: Math.round(hours*100)/100
        }
        return costBreakdown
    }

    if(hours> 24) {
        const numberOfFullDaysParked = Math.floor(runningHour/24)
        const fullDayCosts = numberOfFullDaysParked * 5000
        runningHour -= numberOfFullDaysParked * 24
        
        const continuousTotal = Math.ceil(runningHour) * parkingPrices[parkingSize]
        costBreakdown = {
            numberOfFullDays: numberOfFullDaysParked,
            fullDayCosts: fullDayCosts,

            continuousHours: Math.ceil(runningHour),
            continuousTotal: continuousTotal,

            parkingSize: parkingSize,
            total: fullDayCosts + continuousTotal,
            totalHours: Math.round(hours*100)/100
        }
        return costBreakdown
    }
}

export const determineWhichParkingToUse = (parking1, parking2) => {
    const sizeOrder = ['small', 'medium', 'large']
    if (sizeOrder.indexOf(parking1) > sizeOrder.indexOf(parking2)) {
        return parking1;
    } else {
        return parking2;
    }
}

export const getDateTimeNow = () => {
    const now = new Date();
    const year = now.getFullYear().toString().padStart(4, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    const initialDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    return initialDateTime
}

export const validateDateFormat = (input) => {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    return regex.test(input);
}