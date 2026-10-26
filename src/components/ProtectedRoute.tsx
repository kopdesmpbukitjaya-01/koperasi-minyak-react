import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Preferences } from "@capacitor/preferences";


export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);


  useEffect(() => {


    async function checkSession() {


      // cek session Supabase normal

      const {
        data
      } = await supabase.auth.getSession();



      if (data.session) {

        setSession(data.session);

        setLoading(false);

        return;

      }



      // cek session Android Preferences

      const saved =
        await Preferences.get({
          key: "kdmp_session"
        });



      if (saved.value) {


        const oldSession =
          JSON.parse(saved.value);



        const {
          error
        } = await supabase.auth.setSession({

          access_token:
            oldSession.access_token,

          refresh_token:
            oldSession.refresh_token,

        });



        if (!error) {

          setSession(oldSession);

        }


      }



      setLoading(false);


    }



    checkSession();



    const {
      data: listener
    } =
    supabase.auth.onAuthStateChange(
      (_event, newSession) => {

        setSession(newSession);

      }
    );



    return () => {

      listener.subscription.unsubscribe();

    };


  }, []);



  if (loading) {

    return <div>Loading...</div>;

  }



  if (!session) {

    return <Navigate to="/login" replace />;

  }



  return <>{children}</>;

}