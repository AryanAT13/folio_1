"use client";

import { Button } from "@/components/ui/Button";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type LoadMoreProps<T extends string | number = any> = {
  initialOffset: T;
  loadMoreAction: (offset: T) => Promise<readonly [React.ReactNode, T | null]>;
  children: React.ReactNode;
};

export function LoadMore<T extends string | number = any>({
  children,
  initialOffset,
  loadMoreAction,
}: LoadMoreProps<T>) {
  const [items, setItems] = useState<React.ReactNode[]>([]);
  const [offset, setOffset] = useState<T | null>(initialOffset);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  useEffect(() => {
    const loadMoreItems = async () => {
      if (loading || !offset) return;
      setLoading(true);
      try {
        const [newItems, nextOffset] = await loadMoreAction(offset);
        setItems((prev) => [...prev, newItems]);
        setOffset(nextOffset);
      } catch (error) {
        console.error("Error loading more items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (inView) {
      loadMoreItems();
    }
  }, [inView, loading, loadMoreAction, offset]);

  return (
    <>
      {children}
      {items}
      {offset && (
        <div ref={ref} className="flex justify-center my-8">
            {loading && <Loader className="mr-2 h-6 w-6 animate-spin" />}
        </div>
      )}
    </>
  );
}