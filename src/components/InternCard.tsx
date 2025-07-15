import { Card, CardContent, Typography, Link } from "@mui/material";
import type { Intern } from "../types/intern";

type Props = {
  intern: Intern;
};

export default function InternCard({ intern }: Props) {
  return (
    <Card
      sx={{
        marginBottom: 2,
        padding: 2,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#f5f5f5",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6">{intern.name}</Typography>
        <Typography>{intern.email}</Typography>
        <Typography className="text-sm text-gray-500">
          Joined: {new Date(intern.joined_date).toLocaleDateString()}
        </Typography>

        {intern.profile && (
          <>
            <Typography className="mt-2 font-bold">Bio:</Typography>
            <Typography>{intern.profile.bio}</Typography>
            <Typography>
              LinkedIn:{" "}
              <a className="text-blue-500" href={intern.profile.linkedin}>
                {intern.profile.linkedin}
              </a>
            </Typography>
          </>
        )}
        <Link href={`/interns/${intern.id}/tasks`} className="text-blue-500">
          View Tasks
        </Link>
      </CardContent>
    </Card>
  );
}
