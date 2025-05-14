'use client';

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function SubscriptionForm(props) {
  const {
    onSubmit,
    closeInput,
    formData,
    handleChangeInput,
    handleResetForm,
    currentUser
  } = props;

  const { handleAddSubscription } = useAuth();

  async function handleFormSubmit(e) {
    e.preventDefault(); // Prevent page reload

    console.log("Submitting subscription:", formData);
    if (!currentUser || !currentUser.uid) {
        console.error("❌ Cannot add subscription: No user authenticated");
        return;
      }
      const enrichedData = {
        ...formData,
        userId: currentUser.uid
      };
    try {
      await handleAddSubscription(enrichedData); // Ensure it completes before proceeding
      handleResetForm();
      closeInput();
    } catch (err) {
      console.error("Error adding subscription:", err);
    }
  }

  return (
    <section>
      <h2>Add a new subscription</h2>

      <form onSubmit={handleFormSubmit}>
        <label>
          <span>Subscription Name</span>
          <input
            value={formData.name}
            onChange={handleChangeInput}
            type="text"
            name="name"
            placeholder="e.g. Netflix, Spotify, AWS Hosting"
            required
          />
        </label>

        <label>
          <span>Category</span>
          <select value={formData.category} onChange={handleChangeInput} name="category">
            {['Entertainment', 'Music', 'Software', 'Web Services', 'Health & Fitness', 'Other'].map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Cost</span>
          <input
            value={formData.cost}
            onChange={handleChangeInput}
            type="number"
            name="cost"
            step="0.01"
            placeholder="e.g. 12.00"
            required
          />
        </label>

        <label>
          <span>Currency</span>
          <select value={formData.currency} onChange={handleChangeInput} name="currency">
            {['USD', 'EUR', 'GBP', 'NZD', 'AUD', 'Other'].map((cur, index) => (
              <option key={index} value={cur}>{cur}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Billing Frequency</span>
          <select value={formData.billingFrequency} onChange={handleChangeInput} name="billingFrequency">
            {['Monthly', 'Yearly', 'Quarterly', 'One-time'].map((freq, index) => (
              <option key={index} value={freq}>{freq}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Payment Method</span>
          <select value={formData.paymentMethod} onChange={handleChangeInput} name="paymentMethod">
            {['Credit Card', 'Debit Card', 'Paypal', 'Bank Transfer', 'Other'].map((method, index) => (
              <option key={index} value={method}>{method}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Subscription Start Date</span>
          <input
            value={formData.startDate}
            onChange={handleChangeInput}
            type="date"
            name="startDate"
            required
          />
        </label>

        <label>
          <span>Status</span>
          <select value={formData.status} onChange={handleChangeInput} name="status">
            {['Active', 'Paused', 'Cancelled'].map((status, index) => (
              <option key={index} value={status}>{status}</option>
            ))}
          </select>
        </label>

        <label className="fat-column">
          <span>Notes</span>
          <textarea
            value={formData.notes}
            onChange={handleChangeInput}
            name="notes"
            placeholder="e.g. Shared with family, includes cloud storage"
          />
        </label>

        <div className="fat-column form-submit-btns">
          <button type="button" onClick={closeInput}>Cancel</button>
          <button type="submit">Add Subscription</button>
        </div>
      </form>
    </section>
  );
}
