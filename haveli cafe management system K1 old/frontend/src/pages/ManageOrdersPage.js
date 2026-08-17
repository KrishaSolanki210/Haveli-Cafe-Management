import React from "react";

import EmptyState from "../components/EmptyState";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";

function ManageOrdersPage() {
  return (
    <Layout>
      <SectionHeader eyebrow="Staff Orders" title="Manage current orders" subtitle="The backend currently exposes status update APIs for staff, but not a dedicated staff order list endpoint." />
      <EmptyState
        title="Use Update Status with an order ID"
        subtitle="Once the backend adds a staff order-list API, this page can render the live kitchen queue. The rest of the staff workflow is already wired."
      />
    </Layout>
  );
}

export default ManageOrdersPage;
