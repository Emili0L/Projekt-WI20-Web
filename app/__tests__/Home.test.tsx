import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Home from "../src/pages/[...pathArray]";

test("home", () => {
  render(<Home />);
  const main = within(screen.getByRole("main"));

  // check if the map got rendered
  expect(main.getByRole("map")).toBeDefined();
});
