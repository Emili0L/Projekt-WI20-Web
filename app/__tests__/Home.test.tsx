import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Home from "../src/pages/index";

test("home", () => {
  render(<Home coordinates={[]} />);
  const main = within(screen.getByRole("main"));

  // check if the map got rendered
  expect(main.getByRole("map")).toBeDefined();
});
