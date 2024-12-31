import { use } from "react";
import ClientPage from "./ClientPage";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function Page({ params }: PageProps) {
  const { username } = use(params);
  //   const [user, setUser] = useState<User | null>(null);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState<Error>();

  //   useEffect(() => {
  //     axiosClient
  //       .get(`/users?username=${username}`)
  //       .then((response) => {
  //         setUser(response.data);
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         setError(error);
  //       });
  //   }, [username]);

  //   if (loading) {
  //     return <p>Loading...</p>;
  //   }

  //   if (error) {
  //     return <p>Error: {error.message}</p>;
  //   }

  return <ClientPage username={username} />;
}
