import React from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";

export default function NotFound() {
  return (
    <PageWrapper title="Page Not Found" subtitle="This route does not exist yet.">
      <Link to="/" className="btn-primary inline-flex w-fit">
        Back to Home
      </Link>
    </PageWrapper>
  );
}