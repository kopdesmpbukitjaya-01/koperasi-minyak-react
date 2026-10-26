import { useEffect } from "react";
import { App } from "@capacitor/app";
import { useNavigate } from "react-router-dom";

export default function AndroidBackHandler(){

  const navigate = useNavigate();


  useEffect(()=>{


    const listener =
      App.addListener(
        "backButton",
        ({canGoBack})=>{


          if(canGoBack){

            window.history.back();

          }else{

            navigate("/");

          }


        }
      );



    return ()=>{

      listener.then(
        item=>item.remove()
      );

    };


  },[]);



  return null;

}