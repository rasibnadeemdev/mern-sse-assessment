import listingSchema, { IListing } from "./listing.schema";

class ListingService {
  public async createListing(
    sellerId: string,
    listingData: Partial<IListing>
  ): Promise<IListing> {
    const newListing = new listingSchema({
      ...listingData,
      seller: sellerId,
      status: "active",
    });
    await newListing.save();
    return newListing;
  }

  public async updateListing(
    id: string,
    sellerId: string,
    updateData: Partial<IListing>
  ): Promise<IListing | null> {
    const listing = await listingSchema.findOne({ _id: id, seller: sellerId });
    if (!listing) {
      throw new Error("This listing does not exists");
    }

    Object.assign(listing, updateData);
    await listing.save();
    return listing;
  }

  public async deleteListing(id: string, sellerId: string): Promise<string> {
    const listing = await listingSchema.findOne({ _id: id, seller: sellerId });
    if (!listing) {
      throw new Error("Listing does not exists");
    }

    await listing.deleteOne();
    return "Listing deleted successfully";
  }

  public async markAsComplete(
    id: string,
    sellerId: string
  ): Promise<IListing | null> {
    const listing = await listingSchema.findOne({ _id: id, seller: sellerId });
    if (!listing) {
      throw new Error("Listing does not exists");
    }

    listing.status = "completed";
    await listing.save();
    return listing;
  }
}

export default new ListingService();
