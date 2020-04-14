import React from 'react';
import Can from '../../config/Can'; 

export const Landing = () => {
    return(
        <Can I="view" a="Profile" passThrough>
           {allowed => <button disabled={!allowed}>Welcome to Mohassel</button >}
        </Can>
    )
}