"use client";

import { RedocStandalone } from "redoc";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  spec: Record<string, any>;
};

function ReactSwagger({ spec }: Props) {
  return <RedocStandalone spec={spec} />;
}

export default ReactSwagger;
