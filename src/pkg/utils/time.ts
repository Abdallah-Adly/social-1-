type TimeUnit='seconds' | 'minutes' | 'hours' | 'days' | 'millSeconds';
export function toMs(time:number,unit:TimeUnit){
    switch (unit) {
        case 'seconds':
            return time * 1000;
        case 'minutes':
            return time * 60 * 1000;
        case 'hours':
            return time * 60 * 60 * 1000;
        default:
            return time;
    }
}

export function toSeconds(time:number, unit:string){
    switch (unit) {
        case 'millSeconds':
            return time / 1000;
        case 'minutes':
            return time * 60 ;
        case 'hours':
            return time * 60 * 60 ;
        default:
            return time;
    }
}