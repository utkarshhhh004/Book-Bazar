
import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { parseBookQuery } from "./books.validation.js";

const router = Router();

// GET /api/v1/books
// Public book catalogue

router.get("/", async (req, res) => {
  try {
    const filters = parseBookQuery(
      req.query as Record<string, unknown>
    );

    const where: Prisma.BookListingWhereInput = {
      status: "ACTIVE",
      availableQty: { gt: 0 },
      ...(filters.condition
        ? { condition: filters.condition }
        : {}),
      ...(filters.minPrice !== undefined ||
      filters.maxPrice !== undefined
        ? {
            pricePaise: {
              ...(filters.minPrice !== undefined
                ? { gte: Math.round(filters.minPrice * 100) }
                : {}),
              ...(filters.maxPrice !== undefined
                ? { lte: Math.round(filters.maxPrice * 100) }
                : {}),
            },
          }
        : {}),
      ...(filters.search
        ? {
            book: {
              is: {
                OR: [
                  {
                    title: {
                      contains: filters.search,
                      mode: "insensitive",
                    },
                  },
                  {
                    author: {
                      contains: filters.search,
                      mode: "insensitive",
                    },
                  },
                  {
                    isbn: {
                      contains: filters.search,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            },
          }
        : {}),
    };

    const orderBy: Prisma.BookListingOrderByWithRelationInput =
      filters.sort === "price_asc"
        ? { pricePaise: "asc" }
        : filters.sort === "price_desc"
          ? { pricePaise: "desc" }
          : { createdAt: "desc" };

    const skip = (filters.page - 1) * filters.limit;

    const [listings, total] = await Promise.all([
      prisma.bookListing.findMany({
        where,
        include: {
          book: true,
          seller: {
            select: {
              id: true,
              profile: {
                select: {
                  fullName: true,
                },
              },
            },
          },
        },
        orderBy,
        skip,
        take: filters.limit,
      }),

      prisma.bookListing.count({ where }),
    ]);

    res.json({
      success: true,
      data: listings,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    });
  } catch (error) {
    console.error("Book catalogue error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch books",
    });
  }
});

// GET /api/v1/books/:id
// Individual book listing

router.get("/:id", async (req, res) => {
  try {
    const listing = await prisma.bookListing.findFirst({
      where: {
        id: req.params.id,
        status: "ACTIVE",
        availableQty: { gt: 0 },
      },
      include: {
        book: true,
        seller: {
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Book listing not found",
      });
    }

    return res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Book details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch book details",
    });
  }
});

export default router;
