/// <reference types="node" />
/**
 * Interface for other classes to implement, which should be signable.
 */
export interface Signable {
    /**
     * Get the sign content of object
     */
    getSignContent(): Buffer;
}
