import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Layout from "../src/components/Layout";

test("map", () => {
  render(<Layout />);
  const main = within(screen.getByRole("main"));

  // check if the map got rendered
  expect(main.getByRole("map")).toBeDefined();
});
