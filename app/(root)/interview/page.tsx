import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();

  //Todo's: Make the login again suggestion page better
  if (!user) return <>Please log in again</>;

  return (
    <>
      <h3>Interview Generation</h3>
      <Agent userName={user?.name} userId={user?.id} type="generate" />
    </>
  );
};

export default page;
