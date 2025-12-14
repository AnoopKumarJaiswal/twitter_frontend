import { createContext, useContext, useState } from "react";

const UtilContext = createContext()


export function UtilContextProvider({children})
{
    const[showSidebar, setShowSidebar] = useState(false)

    return(
        <UtilContext.Provider value={{showSidebar, setShowSidebar}}>
            {children}
        </UtilContext.Provider>
    )
}



export function useUtilContext()
{
    return useContext(UtilContext)
}