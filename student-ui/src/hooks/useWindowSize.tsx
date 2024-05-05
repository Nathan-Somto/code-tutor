import React from "react"

export function useWindowSize(){
    const [sizes, setSizes] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const handleSize = (_ev: UIEvent) => {
        setSizes({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }
    React.useEffect(() => {
         window.addEventListener('resize', handleSize);
        return () => window.removeEventListener('resize', handleSize)
    }, [])
    return sizes
}