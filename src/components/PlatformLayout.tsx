import { Capacitor } from "@capacitor/core";

import Layout from "./Layout";
import MobileLayout from "./MobileLayout";


export default function PlatformLayout({
children
}:any){


const isAndroid =
Capacitor.isNativePlatform();



if(isAndroid){

return (

<MobileLayout>
{children}
</MobileLayout>

);

}


return (

<Layout>
{children}
</Layout>

);

}
