import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { SessionCard } from "../SessionCard";

describe("SessionCard", () => {
  const defaultProps = {
    id: 1,
    date: "2026-02-20T00:00:00Z",
    type: "HIIT" as const,
    duration: 45,
    rpe: 8,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it("clicking card triggers onEdit with session id", () => {
    const onEdit = vi.fn();
    const { container } = render(
      <SessionCard {...defaultProps} onEdit={onEdit} />,
    );
    const card = container.querySelector(".cursor-pointer") as HTMLElement;
    fireEvent.click(card);
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it("clicking delete triggers onDelete without triggering onEdit", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const { container } = render(
      <SessionCard {...defaultProps} onEdit={onEdit} onDelete={onDelete} />,
    );
    const deleteBtn = container.querySelector("button") as HTMLElement;
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith(1);
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("card root has cursor-pointer class", () => {
    const { container } = render(<SessionCard {...defaultProps} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("cursor-pointer");
  });

  it("displays session load correctly", () => {
    const { container } = render(<SessionCard {...defaultProps} />);
    expect(container.textContent).toContain("360 Load");
  });
});
