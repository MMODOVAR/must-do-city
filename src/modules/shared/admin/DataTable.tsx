/** Minimal table shell used by every admin list page. */
export function DataTable({ head, empty, children, isEmpty }: { head: string[]; empty: string; isEmpty: boolean; children: React.ReactNode }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-stone-200 text-left text-stone-500">
          <tr>{head.map((h, i) => <th key={i} className="whitespace-nowrap p-4 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {children}
          {isEmpty && (
            <tr><td colSpan={head.length} className="p-6 text-center text-stone-500">{empty}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
